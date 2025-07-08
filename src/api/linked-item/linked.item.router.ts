import { Router } from 'express';
import {
  list,
  findOne,
  create,
  remove,
  getSingleEventSubs,
  updateLinkedItem
} from './linked.item.controller';

import { isAuthenticated } from "../../utils/auth/authenticated-middleware";

const router = Router();

router.use(isAuthenticated);

// Questa rotta va messa prima di `/:id` per evitare conflitti
router.get('/event/:baseItemId/subs', getSingleEventSubs);

router.get('/', list);
router.get('/:id', findOne);

router.post('/', create);

router.patch("/:id", updateLinkedItem);

router.delete('/:id', remove);

export default router;
