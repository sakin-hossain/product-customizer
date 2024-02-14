import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";

enum FormNames {
  FIRST_NAME_FORM = "firstNameForm",
  LAST_NAME_FORM = "lastNameForm",
}

export const action: ActionFunction = async ({ request }) => {
  await new Promise((res) => setTimeout(res, 1000)); // Simulate server delay
  const formData = await request.formData();
  const formName = formData.get("formName");
  console.log(formName, "formName__________________________________");

  switch (formName) {
    case FormNames.FIRST_NAME_FORM:
      const firstName = formData.get("firstName");
      console.log("Received first name:", firstName);
      return json({ message: `Received first name: ${firstName}` });

    case FormNames.LAST_NAME_FORM:
      const lastName = formData.get("lastName");
      console.log("Received last name:", lastName);
      return json({ message: `Received last name: ${lastName}` });

    default:
      return json({ error: "Invalid form submission" });
  }
};

export default function MyPage() {
  const data = useActionData<typeof action>();
  const navigation = useNavigation();
  const formName = navigation.submission?.formData.get("formName");

  console.log(navigation, "navigation_______");

  let firstNameFormText = "Submit first name";
  let lastNameFormText = "Submit last name";

  switch (formName) {
    case FormNames.FIRST_NAME_FORM:
      firstNameFormText =
        navigation.state === "submitting"
          ? "Submitting first name..."
          : "Submit first name";
      break;

    case FormNames.LAST_NAME_FORM:
      lastNameFormText =
        navigation.state === "submitting"
          ? "Submitting last name..."
          : "Submit last name";
      break;

    // Add more cases for other forms if needed

    default:
    // Handle default form text
  }

  return (
    <div>
      <h1>Multiple Forms Example</h1>
      {data?.message && <p>{data.message}</p>}
      <Form method="post">
        <input
          type="hidden"
          name="formName"
          value={FormNames.FIRST_NAME_FORM}
        />
        <input type="text" name="firstName" placeholder="First Name" />
        <button type="submit">{firstNameFormText}</button>
      </Form>

      <Form method="post">
        <input type="hidden" name="formName" value={FormNames.LAST_NAME_FORM} />
        <input type="text" name="lastName" placeholder="Last Name" />
        <button type="submit">{lastNameFormText}</button>
      </Form>
    </div>
  );
}
