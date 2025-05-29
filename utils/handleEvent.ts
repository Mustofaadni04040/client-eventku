export const handlePlusKeyPoint = (form: any) => {
  let _tem = [...form.getValues("keyPoint")];
  _tem.push("");

  form.setValue("keyPoint", _tem);
};

export const handlePlusTicket = (form: any) => {
  let _tem = [...form.getValues("tickets")];
  _tem.push({
    type: "",
    statusTicketCategories: "",
    stock: "",
    price: "",
  });

  form.setValue("tickets", _tem);
};

export const handleMinusKeyPoint = (index: number, form: any) => {
  let _tem = [...form.getValues("keyPoint")];
  _tem.splice(index, 1);

  form.setValue("keyPoint", _tem);
};

export const handleMinusTicket = (index: number, form: any) => {
  let _tem = [...form.getValues("tickets")];
  _tem.splice(index, 1);

  form.setValue("tickets", _tem);
};
