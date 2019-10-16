import express from 'express';
import HttpStatus from 'http-status-codes';
import ContentDefinition from 'kdc-cms-models/models/contentDefinition';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const list = await new ContentDefinition().list();
    res.status(HttpStatus.OK);
    res.send(list);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(error);
  }
});

router.post('/', async (req, res) => {
  try {
    const { body } = req;
    const id = await new ContentDefinition().post(body);
    res.status(HttpStatus.CREATED);
    res.send({ id });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(error);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    await new ContentDefinition().put({ id, attr: body });
    res.status(HttpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await new ContentDefinition().delete({ id });
    res.status(HttpStatus.NO_CONTENT);
    res.send();
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    res.send(error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await new ContentDefinition().get({ id });
    res.status(HttpStatus.OK);
    res.send(item);
  } catch (error) {
    res.status(HttpStatus.NOT_FOUND);
    res.send(error);
  }
});

export default router;
