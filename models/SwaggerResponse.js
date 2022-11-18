/**
 * @swagger
 * components:
 *   schema:
 *     CreateUserInput:
 *       type: object
 *       required:
 *        -name
 *        -email
 *       properties:
 *        name:
 *          type: string
 *        email:
 *          type: string
 *        mobile:
 *          type: string
 *        password:
 *          type: string
 *        avatar:
 *          type: file
 *        role:
 *          type: string
 *          enum: [admin, user]
 *          default: user
 *
 *
 *     CreateUserResponse:
 *       type: object
 *       properties:
 *         name:
 *          type: string
 *         email:
 *          type: string
 *         id:
 *          type: string
 *         avatar:
 *          type:string
 *         role:
 *          type:string
 *         createdAt:
 *          type: string
 *         updatedAt:
 *          type: string
 *
 *
 *     LoginInput:
 *       type: object
 *       properties:
 *         username:
 *          type: string
 *         password:
 *          type: string
 *
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *          type: boolean
 *         message:
 *          type: string
 *         data:
 *          type: object
 *          properties:
 *           id:
 *            type: string
 *           name:
 *            type: string
 *           mobile:
 *            type: string
 *           email:
 *            type: string
 *           avatar:
 *            type: string
 *           googleID:
 *            type: string
 *           role:
 *            type: string
 *           token:
 *            type: string
 */
