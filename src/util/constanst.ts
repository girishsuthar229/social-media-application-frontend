export const commonFilePath = process.env.NEXT_PUBLIC_IMAGE_CLOUDINARY_BASE_URL;

export class Common {
  static RegularExpression = class RegularExpression {
    public static readonly UsernameRegex = new RegExp(/^(?=.*\d)[a-zA-Z0-9]+$/);
    public static readonly DigitsRegularExp = new RegExp(/^[0-9]*$/);
    public static readonly EmailRegularExp = new RegExp(
      /^(?=.{1,64}@)(([^<>()[\].,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(?=.{1,255}$)((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    public static readonly PasswordRegularExp = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/u
    );
    public static readonly UpdatePasswordRegularExp = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/
    );

    public static readonly AlphabetsOnlyRegularExp = /^[A-Za-z]+$/;
    public static readonly MobileNumberRegularExp = /^\+?\d+$/;

    // AlphaSpaceRegex: Allows alphabets and space
    public static readonly AlphaSpaceRegex = new RegExp(/^[a-zA-Z\s]+$/);
    // AlphaSpaceRegex: Allows alphabets and space
    public static readonly AlphaNumericSpaceRegex = /^[a-zA-Z0-9\s]+$/;
    // AlphaNumSpecialCharRegex: Allows alphabets, numbers and special characters
    public static readonly AlphaNumSpecialCharRegex = new RegExp(
      /^[a-zA-Z0-9\s\-\_',.#\/\\]+$/
    );
    // AlphaNumRegex: Allows alphabets and numbers

    public static readonly AlphaNumRegex = new RegExp(/^[a-zA-Z0-9\s]+$/);
    // NumDecimalRegex: Allows numbers and decimals
    public static readonly NumDecimalRegex = new RegExp(/^[\-]?\d*[\.]?[\d]*$/);
    // NumberRegex: Allows numbers
    public static readonly NumberRegex = new RegExp(/^[0-9]*$/);
    // AlphaNumSpaceDashRegex: Allows alphabets, numbers, space and dash
    public static readonly AlphaNumSpaceDashRegex = new RegExp(
      /^[A-Za-z0-9\- ]+$/
    );
    // AlphaUnderscoreRegex: Allows alphabets and underscore
    public static readonly AlphaUnderscoreRegex = new RegExp(/^[A-Za-z_]+$/);

    // decimal number with up to 10 total digits,
    public static readonly DECIMAL_10_2_REGEX = new RegExp(
      /^\d{1,8}(\.\d{1,2})?$/
    );
  };
}

export enum localStorageKeys {
  ACCESS_TOKEN = "accessToken",
  TOKEN_EXPIRES_AT = "tokenExpiresAt",
}

export enum FollowingsEnum {
  PENDING = "pending",
  ACCEPTED = "accepted",
}

export enum STATUS_ERROR {
  UserNotFound = "UserNotFound",
  UserAcountPrivate = "UserAcountPrivate",
}

export enum STATUS_CODES {
  success = 200,
  create = 201,
  unauthorized = 401,
  badRequest = 400,
  forbidden = 403,
  notFound = 404,
  internalServerError = 500,
  Conflict = 409,
}

export const RouterURLs = {
  signUp: "/sign-up",
  signIn: "/sign-in",
  forgetPassword: "/forgot-password",
  otpVerification: "/otp-verification",
  setPassword: "/set-password",
};

export const AuthBaseRoute = {
  home: "/home",
  reels: "/reels",
  findFirends: "/find-friends",
  createPost: "/create-post",
  notification: "/notification",
  profile: "/profile",
  profileEdit: "/profile/edit",
  anotherProfile: "/profile/user-name",
};
