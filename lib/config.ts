/** Site-wide contact config — single source of truth.
 *  TODO(launch): replace with Shivanii's real WhatsApp number. */
export const WHATSAPP_NUMBER = "919XXXXXXXXX";

export function waLink(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
