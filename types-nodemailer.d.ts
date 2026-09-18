// Fallback declaration for deployments where @types/nodemailer is not installed.
declare module "nodemailer" {
  const nodemailer: any;
  export default nodemailer;
}
