export default function safelyDefault(fn: () => any, defaultValue: any) {
  try {
    return fn();
  } catch (e) {
    return defaultValue;
  }
}
