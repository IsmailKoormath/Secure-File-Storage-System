const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

export const api = async (
  url: string,
  options: RequestInit = {}
): Promise<any> => {
  const isFormData = options.body instanceof FormData;
  const token = getAccessToken();

  const res = await fetch(`${baseUrl}${url}`, {
    credentials: "include", // needed for cookies (e.g., refreshToken)
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Something went wrong");
  }

  return res.json();
};
