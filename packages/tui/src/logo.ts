// FUSION brand logo. Brand surface only, no functional code.
//
// `left` renders in the accent colour and `right` in the foreground, so the
// seam between them is visible. The wordmark is split FU | SION at that seam,
// and the mark on row 0 straddles it: the accent-coloured triangle belongs to
// the left half, the foreground one to the right, so two differently coloured
// nuclei meet exactly where the two halves of the name join. It costs no extra
// rows, because row 0 already existed.
//
// Characters in `marks` render dim, and are used to fill the empty cells inside
// a glyph's bounding box, as upstream does.
//
// Kept from the previous version and worth not undoing: the halves used to be
// concatenated with no gap, so U and S collided and their bottom edges merged
// into an eight-cell bar that read as a rendering fault. The trailing space on
// each `left` row is what separates them.
export const logo = {
  left: ["         ▸", "█▀▀▀ █__█ ", "█▀▀_ █__█ ", "▀___ ▀▀▀▀ "],
  right: ["◂                 ", "█▀▀▀ ▀█▀ █▀▀█ █▀▀▄", "▀▀▀█ _█_ █__█ █__█", "▀▀▀▀ ▀▀▀ ▀▀▀▀ ▀  ▀"],
}

export const go = {
  left: ["    ", "█▀▀▀", "█▀▀_", "▀___"],
  right: ["    ", "█__█", "█__█", "▀▀▀▀"],
}

export const marks = "_^~,"
