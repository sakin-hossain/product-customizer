import { Form } from "@remix-run/react";
import { Button, FormLayout, InlineStack } from "@shopify/polaris";
import { FormNames } from "~/routes/app.$productId_.edit";

const ImageTab = () => {
  return (
    <div>
      <Form method="post">
        <input type="hidden" name="formName" value={FormNames.SVG_FORM} />
        <FormLayout>
          <label htmlFor="svg-image">Please give your svg code here</label>
          <textarea
            name="svg-image"
            id="svg-image"
            cols={50}
            rows={20}
          ></textarea>
          <InlineStack align="end">
            <Button submit variant="primary" size="large">
              Save
            </Button>
          </InlineStack>
        </FormLayout>
      </Form>
    </div>
  );
};

export default ImageTab;
