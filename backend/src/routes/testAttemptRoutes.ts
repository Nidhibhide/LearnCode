// import { getAll} from "../controllers/test";
import express from "express";
import IsLoggeedIn from "../middlewares/TokenAuth";
import { getAttempted } from "../controllers/testAttempt";

import RoleAuth from "../middlewares/RoleAuth";

const router = express.Router();


router.get("/getAttempted/:user", IsLoggeedIn, RoleAuth("user"), getAttempted);

export default router;
