import { handleGetContactById, handleGetContacts, handleSubmitContact, handleResolveContact } from "../repositories/contact.repository.js";
import { RequestHandlerCustom } from "../utils/configs/custom.js";
import { parseRequestData } from "../utils/configs/helper.js";

export const getAllContacts = RequestHandlerCustom(
  async (req, res) => {
    const contacts = await handleGetContacts();

    res.status(200).json({
      success: true,
      message: "Get all contacts successfully",
      contacts: contacts
    });
  }
);

export const getContact = RequestHandlerCustom(
  async (req, res) => {
    const id = req.params.id;

    const contact = await handleGetContactById({ id });

    res.status(200).json({
      success: true,
      message: "Get contact successfully",
      contact: contact
    });
  }
);

export interface ISubmitContactData {
  name: string,
  email: string,
  program: string,
  phone: string,
  message: string
};

export const submitContact = RequestHandlerCustom(
  async (req, res) => {
    const data: ISubmitContactData = parseRequestData(req);
    const contact = await handleSubmitContact(data);

    res.status(201).json({
      success: true,
      message: "New contact created",
      contact: contact
    });
  }
);

export const resolveContact = RequestHandlerCustom(
  async (req, res) => {
    const id = req.params.id;
    const resolvedBy = req.params.userId;

    const contact = await handleResolveContact({ id, resolvedBy });

    res.status(200).json({
      success: true,
      message: "Contact resolved successfully",
      contact: contact
    });
  }
);