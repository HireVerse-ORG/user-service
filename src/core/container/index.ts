import { Container } from "inversify";
import { loadUserContainer } from "../../modules/user/user.module";
import { loadOtpContainer } from "../../modules/otp/otp.module";
import { loadEventContainer } from "../../modules/event/event.module";
import { loadExternalContainer } from "../../modules/external/externa.module";

const container = new Container();

loadExternalContainer(container);
loadUserContainer(container);
loadOtpContainer(container);
loadEventContainer(container);

export { container };

