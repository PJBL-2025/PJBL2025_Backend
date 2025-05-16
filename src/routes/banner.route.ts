import { Router } from "express";
import { getBanner } from "../controllers/banner.controller";

const bannerRoute = Router()

bannerRoute.get('/', getBanner)

export default bannerRoute