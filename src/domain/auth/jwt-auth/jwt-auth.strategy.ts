// import { Injectable } from "@nestjs/common";
// import { PassportStrategy } from "@nestjs/passport";
// import { strategies } from "passport";
// import { ExtractJwt, Strategy } from "passport-jwt";

// @Injectable
// export class JwtAuthStrategy extends PassportStrategy(Strategy) {
//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: 'secretKey',
//     });
//   }

//   async validate(payload: any) {
//     return { userId: payload.sub, phone: payload.phone };
//   }
// }
