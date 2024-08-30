"use server";

export async function registerUserAction(formData) {
  console.log("Hello From Register User Action");

  const fields = {
    username: formData.get("username"),
    password: formData.get("password"),
    email: formData.get("email"),
  };

  //de acá llamar la api= http://localhost:4000/graphql
  console.log("#############");
  console.log(fields);
  console.log("#############");
};

export async function logUserAction(formData) {
  console.log("Hello From Register User Action");

  const fields = {
    password: formData.get("password"),
    identifier: formData.get("identifier"),
  };

  console.log("#############");
  console.log(fields);
  console.log("#############");
}