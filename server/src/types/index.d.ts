declare module "qrcode" {
  export function toDataURL(text: string | Buffer, options?: any): Promise<string>;
  export function toString(text: string | Buffer, options?: any): Promise<string>;
  export function toFile(path: string, text: string | Buffer, options?: any): Promise<void>;
  export function toBuffer(text: string | Buffer, options?: any): Promise<Buffer>;
}
