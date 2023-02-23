const express = require('express');
const router = express.Router();
const fs = require('fs');
const functionContacts = require('../functions/contacts');
const ERROR_MESSAGES = require('../const/const');

const contacts = JSON.parse(fs.readFileSync('./db/contacts.json', { encoding: 'utf-8' }));

router.get('/', (req, res) => {
  const contactList = functionContacts.listContacts();
  res.status(200).json(contactList);
});

router.get('/:contactId', (req, res) => {
  const contactId = req.params.contactId;

  const foundContact = functionContacts.getContactById(Number(contactId), ERROR_MESSAGES.NOT_FOUND);

  if (!foundContact) {
    return res.status(404).json({
      message: ERROR_MESSAGES.NOT_FOUND,
    });
  }

  res.status(200).json({ foundContact });
});

router.post('/', (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({
      message: ERROR_MESSAGES.MISSING_FIELD,
    });
  }

  const updateContact = functionContacts.addContact(name, email, phone);

  res.status(201).json(updateContact);
});

router.delete('/:contactId', (req, res) => {
  const contactId = req.params.contactId;

  const newContacts = functionContacts.removeContact(Number(contactId), ERROR_MESSAGES.NOT_FOUND);

  if (newContacts.length === contacts.length) {
    return res.status(400).json({
      message: ERROR_MESSAGES.NOT_FOUND,
    });
  }

  res.status(200).json({
    message: `Contact with ID=${contactId} deleted successfully!`,
  });
});

router.patch('/:contactId', (req, res) => {
  const contactId = req.params.contactId;
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({
      message: ERROR_MESSAGES.MISSING_FIELD,
    });
  }

  const updatedContacts = functionContacts.updateContact(
    Number(contactId),
    name,
    email,
    phone,
    ERROR_MESSAGES.NOT_FOUND,
  );

  if (!updatedContacts) {
    return res.status(404).json({
      message: ERROR_MESSAGES.NOT_FOUND,
    });
  }

  res.status(200).json(updatedContacts);
});

module.exports = router;
