import React from "react";

import { GenericConfirmModal, GenericModal } from "@/components/dashboard";

// biome-ignore lint/suspicious/noExplicitAny: explanation
interface FormConfig<TFormProps = any> {
  addTitle?: string;
  editTitle?: string;
  modalClassName?: string;
  form: React.ComponentType<
    TFormProps & { onSubmit: () => void | Promise<void> }
  >;
  // biome-ignore lint/suspicious/noExplicitAny: explanation
  getFormProps?: (action: any) => TFormProps;
}

interface ConfirmConfig {
  title: string;
  description?: string;
  // biome-ignore lint/suspicious/noExplicitAny: explanation
  onConfirm: (action: any) => void | Promise<void>;
}

interface TableModalsConfig {
  form?: FormConfig;
  publish?: ConfirmConfig;
  unpublish?: ConfirmConfig;
  delete?: ConfirmConfig;
}

interface TableModalsProps<TAction> {
  action: TAction | null;
  onClose: () => void;
  config: TableModalsConfig;
}

export const TableModals = <TAction extends { type: string }>({
  action,
  onClose,
  config,
}: TableModalsProps<TAction>) => {
  if (!action) return null;

  const type = action.type as keyof TableModalsConfig | "add" | "edit";

  // Form modals (add/edit)
  if (type === "add" || type === "edit") {
    const formConfig = config.form;
    if (!formConfig) return null;

    const FormComponent = formConfig.form;
    const formProps = formConfig.getFormProps?.(action) ?? {};
    const title =
      type === "add"
        ? formConfig.addTitle || "Add"
        : formConfig.editTitle || "Edit";

    return (
      <GenericModal
        title={title}
        open={true}
        handleClose={onClose}
        className={formConfig.modalClassName}
        content={<FormComponent {...formProps} onSubmit={onClose} />}
      />
    );
  }

  if (type === "publish" || type === "unpublish" || type === "delete") {
    const confirmConfig = config[type];
    if (!confirmConfig) return null;

    return (
      <GenericConfirmModal
        title={confirmConfig.title}
        description={confirmConfig.description}
        open={true}
        handleClose={onClose}
        handleConfirm={async () => {
          await confirmConfig.onConfirm(action);
          onClose();
        }}
      />
    );
  }

  return null;
};
