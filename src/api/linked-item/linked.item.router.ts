import { Router } from 'express';
import {
  list,
  findOne,
  create,
  remove,
  update
} from './linked.item.controller';

import { isAuthenticated } from "../../utils/auth/authenticated-middleware";

const router = Router();

router.use(isAuthenticated);

router.get('/', list);
router.get('/:id', findOne);

router.post('/', create);

router.put("/:id", update);

router.delete('/:id', remove);

export default router;
