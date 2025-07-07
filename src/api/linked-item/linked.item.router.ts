import { Router } from 'express';
import {
  list,
  findOne,
  create,
  adminAction,
  remove,
  getSingleEventSubs
} from './linked.item.controller';

import { isAuthenticated } from "../../utils/auth/authenticated-middleware";

const router = Router();

router.use(isAuthenticated);

// Questa rotta va messa prima di `/:id` per evitare conflitti
router.get('/event/:baseItemId/subs', getSingleEventSubs);

router.get('/', list);
router.get('/:id', findOne);

router.post('/', create);

router.put('/:id', adminAction);
// router.put('/:id', update);

router.delete('/:id', remove);

export default router;
