import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { Modal } from "@shopify/polaris";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const name = body.get("visitorsName");
  return json({ message: `Hello, ${name}` });
}

const EditModal = ({ activator, active, handleChange }: any) => {
  const data = useActionData<typeof action>();
  return (
    <Modal
      activator={activator}
      open={active}
      onClose={handleChange}
      title="Reach more shoppers with Instagram product tags"
      primaryAction={{
        content: "Add Instagram",
        onAction: handleChange,
      }}
      secondaryActions={[
        {
          content: "Learn more",
          onAction: handleChange,
        },
      ]}
    >
      <Modal.Section>
        <Form method="post">
          <input type="text" name="visitorsName" />
          {data ? data.message : "Waiting..."}
        </Form>
      </Modal.Section>
    </Modal>
  );
};

export default EditModal;
