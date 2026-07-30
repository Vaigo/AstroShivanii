/** Site-wide contact config — single source of truth. */
export const WHATSAPP_NUMBER = "919172207635";
export const CONTACT_EMAIL = "guide.shivanii@gmail.com";

export function waLink(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
