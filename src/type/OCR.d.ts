declare interface IBoundingFrame {
  x: number;
  y: number;
  width: number;
  height: number;
  boundingCenterX: number;
  boundingCenterY: number;
}

declare interface ITextLine {
  cornerPoints: Point[];
  elements: ITextElement[];
  frame: IBoundingFrame;
  recognizedLanguages: string[];
  text: string;
}

declare interface ITextBlock {
  cornerPoints: Point[];
  frame: IBoundingFrame;
  lines: ITextLine[];
  recognizedLanguages: string[];
  text: string;
}

declare interface ITextElement {
  text: string;
  frame: IBoundingFrame;
  cornerPoints: IPoint[];
}

declare interface IPoint {
  x: number;
  y: number;
}

declare interface INRICData {
  address: string;
  city: string;
  country: string;
  DOB: string;
  gender: string;
  IDNumber: string;
  name: string;
  placeOfBirth: string;
  postcode: string;
  state: string;
}
