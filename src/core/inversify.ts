import { Container } from "inversify";
import { loadUserContainer } from "../modules/user/user.module";
import { loadOtpContainer } from "../modules/otp/otp.module";

const container = new Container();

loadUserContainer(container);
loadOtpContainer(container);

export { container };

