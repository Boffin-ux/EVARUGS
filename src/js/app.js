import getLocation from "./modules/getLocation.js";
import isWeb from "./modules/isWeb.js";
import openModal from "./modules/openModal.js";
import sliderTouch from "./modules/sliderTouch.js";
import smothScroll from "./modules/smothScroll.js";

isWeb();
smothScroll();
openModal();
sliderTouch.init();
getLocation();

