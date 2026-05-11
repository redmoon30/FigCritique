figma.showUI(__html__, { width: 300, height: 550 });

// Handle messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'select-user') {
    await figma.clientStorage.setAsync('current-user', msg.user);
  }

  if (msg.type === 'create-sticker') {
    const { emoji, user } = msg;
    await createTaggedSticker(emoji, user);
  }

  if (msg.type === 'create-comment') {
    const { emoji, user } = msg;
    await createCommentBox(emoji, user);
  }
};

// Initial state: load saved user
figma.clientStorage.getAsync('current-user').then(user => {
  figma.ui.postMessage({ type: 'init-user', user });
});

/**
 * Creates a Sticker with an identity label in the top right
 */
async function createTaggedSticker(emoji, user) {
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });

  const pos = getPlacementPosition();

  // Create Emoji Text
  const emojiNode = figma.createText();
  emojiNode.characters = emoji;
  emojiNode.fontSize = 64;
  emojiNode.x = pos.x;
  emojiNode.y = pos.y;

  // Create Label
  const label = figma.createText();
  label.characters = user.name;
  label.fontSize = 12;
  label.fontName = { family: "Inter", style: "Bold" };
  label.fills = [{ type: 'SOLID', color: hexToRgb(user.color) }];
  
  // Create Label Background
  const labelBg = figma.createFrame();
  labelBg.layoutMode = "HORIZONTAL";
  labelBg.paddingLeft = 4;
  labelBg.paddingRight = 4;
  labelBg.paddingTop = 2;
  labelBg.paddingBottom = 2;
  labelBg.itemSpacing = 0;
  labelBg.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  labelBg.strokes = [{ type: 'SOLID', color: hexToRgb(user.color) }];
  labelBg.strokeWeight = 1;
  labelBg.cornerRadius = 4;
  labelBg.appendChild(label);

  // Position label at top right of emoji
  // Note: emoji text bounds might be slightly different than visual
  labelBg.x = emojiNode.x + emojiNode.width - 10;
  labelBg.y = emojiNode.y - 5;

  const group = figma.group([emojiNode, labelBg], figma.currentPage);
  group.name = `Sticker by ${user.name}`;
  
  figma.viewport.scrollAndZoomIntoView([group]);
}

/**
 * Creates a Square Shape with Bullet Points and identity label
 */
async function createCommentBox(emoji, user) {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });

  const pos = getPlacementPosition();
  const size = 200;

  // Create Shape
  const shape = figma.createShapeWithText();
  shape.shapeType = 'SQUARE';
  shape.resize(size, size);
  shape.x = pos.x;
  shape.y = pos.y;
  shape.fills = [{ type: 'SOLID', color: hexToRgb(user.color), opacity: 0.1 }];
  shape.strokes = [{ type: 'SOLID', color: hexToRgb(user.color) }];
  shape.strokeWeight = 2;

  // Set Text (Small size)
  shape.text.characters = `${emoji} \n* point A\n* point B`;
  shape.text.fontSize = 12; // FigJam Small text is roughly 12-14px
  
  // Create Identity Tag (Top Right Inside)
  const label = figma.createText();
  label.characters = user.name;
  label.fontSize = 10;
  label.fontName = { family: "Inter", style: "Bold" };
  label.fills = [{ type: 'SOLID', color: hexToRgb(user.color) }];

  const labelContainer = figma.createFrame();
  labelContainer.layoutMode = "HORIZONTAL";
  labelContainer.paddingLeft = 4;
  labelContainer.paddingRight = 4;
  labelContainer.paddingTop = 2;
  labelContainer.paddingBottom = 2;
  labelContainer.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0.8 }];
  labelContainer.cornerRadius = 2;
  labelContainer.appendChild(label);

  // Position label inside the shape at top right
  labelContainer.x = shape.x + size - labelContainer.width - 8;
  labelContainer.y = shape.y + 8;

  const group = figma.group([shape, labelContainer], figma.currentPage);
  group.name = `Comment by ${user.name}`;

  figma.viewport.scrollAndZoomIntoView([group]);
}

/**
 * Helper to get position based on selection or viewport
 */
function getPlacementPosition() {
  const selection = figma.currentPage.selection;
  if (selection.length > 0) {
    const lastNode = selection[selection.length - 1];
    return {
      x: lastNode.x + lastNode.width + 20,
      y: lastNode.y
    };
  } else {
    return {
      x: figma.viewport.center.x - 100,
      y: figma.viewport.center.y - 100
    };
  }
}

/**
 * Color converter
 */
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return { r, g, b };
}
