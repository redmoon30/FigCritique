figma.showUI(__html__, { width: 320, height: 540 });

let fontsReady = false;

// Pre-load fonts at startup so onmessage stays synchronous.
// Synchronous handlers put all mutations in one undo batch → Ctrl+Z works.
async function init() {
  await Promise.all([
    figma.loadFontAsync({ family: "Inter", style: "Regular" }),
    figma.loadFontAsync({ family: "Inter", style: "Medium" }),
    figma.loadFontAsync({ family: "Inter", style: "Bold" }),
  ]);
  fontsReady = true;
  figma.ui.postMessage({ type: 'ready' });
}

init();

figma.ui.onmessage = (msg) => {
  if (!fontsReady) return;
  if (msg.type === 'create-sticker') {
    createTaggedSticker(new Uint8Array(msg.imageData), msg.label, msg.user);
  }
  if (msg.type === 'create-comment') {
    createCommentBox(new Uint8Array(msg.imageData), msg.label, msg.user);
  }
};

function createTaggedSticker(imageBytes, label, user) {
  const pos = getViewportCenter();
  const SIZE = 90;

  const image = figma.createImage(imageBytes);
  const imgRect = figma.createRectangle();
  imgRect.resize(SIZE, SIZE);
  imgRect.x = pos.x;
  imgRect.y = pos.y;
  imgRect.fills = [{ type: 'IMAGE', imageHash: image.hash, scaleMode: 'FIT' }];

  const badge = makeBadge(user.name, user.color);
  badge.x = pos.x + SIZE - 15;
  badge.y = pos.y + SIZE / 2 - 11;

  figma.currentPage.appendChild(imgRect);
  figma.currentPage.appendChild(badge);
  const group = figma.group([imgRect, badge], figma.currentPage);
  group.name = `${label} · ${user.name}`;
}

function createCommentBox(imageBytes, label, user) {
  const pos = getViewportCenter();
  const W = 200, H = 130, ICON = 36;
  const boldFont = { family: "Inter", style: "Bold" };
  const textContent = "XXXX\nXXXX";

  const shape = figma.createShapeWithText();
  shape.shapeType = 'SQUARE';
  shape.resize(W, H);
  shape.x = pos.x;
  shape.y = pos.y;
  shape.fills = [{ type: 'SOLID', color: hexToRgb(user.color) }];

  shape.text.textAlignHorizontal = 'LEFT';
  shape.text.characters = textContent;
  shape.text.setRangeFontName(0, textContent.length, { family: "Inter", style: "Medium" });
  shape.text.setRangeFontSize(0, textContent.length, 14);
  shape.text.setRangeListOptions(0, textContent.length, { type: 'UNORDERED' });

  const image = figma.createImage(imageBytes);
  const iconRect = figma.createRectangle();
  iconRect.resize(ICON, ICON);
  iconRect.x = pos.x + 8;
  iconRect.y = pos.y - ICON / 2;
  iconRect.fills = [{ type: 'IMAGE', imageHash: image.hash, scaleMode: 'FIT' }];

  const badge = makeBadge(user.name, user.color);
  badge.x = pos.x + 8 + ICON + 6;
  badge.y = pos.y - 11;

  figma.currentPage.appendChild(shape);
  figma.currentPage.appendChild(iconRect);
  figma.currentPage.appendChild(badge);
  const group = figma.group([shape, iconRect, badge], figma.currentPage);
  group.name = `${label} · ${user.name}`;
}

function makeBadge(name, color) {
  const text = figma.createText();
  text.fontName = { family: "Inter", style: "Bold" };
  text.fontSize = 12;
  text.fills = [{ type: 'SOLID', color: hexToRgb(color) }];
  text.characters = name;

  const frame = figma.createFrame();
  frame.layoutMode = "HORIZONTAL";
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  frame.primaryAxisAlignItems = "CENTER";
  frame.counterAxisAlignItems = "CENTER";
  frame.paddingLeft = 8;
  frame.paddingRight = 8;
  frame.paddingTop = 4;
  frame.paddingBottom = 4;
  frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  frame.strokes = [{ type: 'SOLID', color: hexToRgb(color) }];
  frame.strokeWeight = 1.5;
  frame.strokeAlign = 'INSIDE';
  frame.cornerRadius = 20;
  frame.appendChild(text);
  return frame;
}

// Always place at viewport center — never move the user's view.
function getViewportCenter() {
  return {
    x: figma.viewport.center.x - 100,
    y: figma.viewport.center.y - 65,
  };
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return { r, g, b };
}
