export const generateCode = (): string => {
  const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  // Generate 6 random characters (letters and numbers)
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * randomChars.length);
    result += randomChars[randomIndex];
  }

  // Generate 4 characters based on timestamp
  const timePart = Date.now().toString().slice(-4); // Last 4 digits of timestamp
  result += timePart;

  return result;
};

export const encodeData = (data: any) => {
  try {
    // Convert object to JSON string
    const jsonString = JSON.stringify(data);
    // Convert to base64 and make URL safe
    const encoded = Buffer.from(jsonString).toString("base64url");
    return encoded;
  } catch (error: any) {
    throw new Error(`Encoding failed: ${error.message}`);
  }
};

export const decodeData = (encodedString: any) => {
  try {
    // Convert from base64url back to string
    const jsonString = Buffer.from(encodedString, "base64url").toString("utf8");
    // Parse back to object
    return JSON.parse(jsonString);
  } catch (error: any) {
    throw new Error(`Decoding failed: ${error.message}`);
  }
};
