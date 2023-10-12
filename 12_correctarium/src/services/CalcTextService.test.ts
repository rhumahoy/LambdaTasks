import mockDate from "mockdate";
import { calcCost, calcDeadline } from "./CalcTextService";

describe("calculate cost", () => {
  let text;

  beforeEach(() => {
    text = "";
  });

  test("should return the cost depending on language", () => {
    text = new Array(2224).fill("a").join("");

    expect(calcCost("ua", text)).toBe(111.2);
    expect(calcCost("ru", text)).toBe(111.2);
    expect(calcCost("eng", text)).toBe(266.88);
  });

  test("should return min value if cost less than it", () => {
    text = "abc";
    expect(calcCost("ua", text)).toBe(50);
    expect(calcCost("ru", text)).toBe(50);
    expect(calcCost("eng", text)).toBe(120);
  });

  test("should add 20% if file extension is not [doc, docx, rtf]", () => {
    text = new Array(1200).fill("a").join("");

    expect(calcCost("ua", text, "txt")).toBe(72);
    expect(calcCost("ua", text, "rtf")).toBe(60);
    expect(calcCost("ru", text, "docx")).toBe(60);
    expect(calcCost("eng", text, "csv")).toBe(173);
    expect(calcCost("eng", text, "doc")).toBe(144);
  });
});

describe("calculate deadline", () => {
  let deadline;

  const s = 1000;
  const m = 60 * s;
  const h = 60 * m;
  const d = 24 * h;

  afterEach(() => {
    deadline = 0;
    mockDate.reset();
  });

  test("should calculate the deadline date", () => {
    mockDate.set(new Date(2023, 9, 5, 12, 23));
    deadline = Math.round((new Date().getTime() + 3 * h + 46 * m) / 1000);

    expect(calcDeadline("ua", 4358, "edit").deadline).toBe(deadline);
    expect(calcDeadline("eng", 1088.91, "edit").deadline).toBe(deadline);
  });

  test("should skip non-working hours", () => {
    mockDate.set(new Date(2023, 9, 5, 9, 0));

    deadline = Math.round((new Date().getTime() + 2 * h + 30 * m) / 1000);
    expect(calcDeadline("ua", 1333, "edit").deadline).toBe(deadline);

    mockDate.set(new Date(2023, 9, 5, 19, 0));
    deadline = Math.round(
      (new Date().getTime() + 1 * d - 7 * h + 30 * m) / 1000
    );
    expect(calcDeadline("eng", 666, "edit").deadline).toBe(deadline);
  });

  test("should skip non-working days", () => {
    mockDate.set(new Date(2023, 9, 6, 16, 23));
    deadline = Math.round((new Date().getTime() + 3 * d - 1 * h) / 1000);

    expect(calcDeadline("ua", 10000, "edit").deadline).toBe(deadline);
    expect(calcDeadline("eng", 2497.5, "edit").deadline).toBe(deadline);
  });

  test("should return min value if deadline is less than it", () => {
    mockDate.set(new Date(2023, 9, 5, 12));
    deadline = Math.round((new Date().getTime() + 1 * h) / 1000);

    expect(calcDeadline("ua", 267, "edit").deadline).toBe(deadline);
    expect(calcDeadline("eng", 52, "edit").deadline).toBe(deadline);
  });

  test("should add 20% if file extension if not [doc, docx, rtf]", () => {
    mockDate.set(new Date(2023, 9, 5, 12));
    deadline = Math.round((new Date().getTime() + 1 * h + 48 * m) / 1000);

    expect(calcDeadline("ua", 1333, "edit", "csv").deadline).toBe(deadline);
    expect(calcDeadline("eng", 333, "edit", "txt").deadline).toBe(deadline);
  });

  test("should follow the timezone offset", () => {
    mockDate.set(new Date(2023, 9, 29, 10));
    deadline = Math.round(
      (new Date().getTime() + 1 * d + 2 * h + 30 * m) / 1000
    );

    expect(calcDeadline("ua", 2666, "edit").deadline).toBe(deadline);
  });
});
