import type { Runner } from "$lib/Runner.js";
export const JSRunner: Runner = (code: string) => {
  try {
    const result = eval(code);
    return {
      stdout: String(result),
      stderr: "",
      exitCode: 0,
    };
  } catch (error) {
    return {
      stdout: "",
      stderr: String(error),
      exitCode: 1,
    };
  }
};
