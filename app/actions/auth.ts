"use server";

export async function authenticate(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
}
