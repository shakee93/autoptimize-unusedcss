import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isImageAudit(audit_id: string) {
  return ['offscreen-images', 'modern-image-formats'].includes(audit_id)
}

export function truncateMiddleOfURL(url: string, maxLength: number): string {
  try {

    if (url === 'Unattributable') {
      return url;
    }

    const parsedURL = new URL(url);

    // Check if the last part of the pathname is empty (no trailing slash)
    const isHomepage = parsedURL.pathname.split('/').pop() === '';

    if (isHomepage) {
      // If it's a homepage, remove the trailing slash and return the URL
      const truncatedURL = `${parsedURL.protocol}//${parsedURL.host}`;
      return truncatedURL;
    }

    const pathSegments = parsedURL.pathname.split('/');
    const penultimatePart = pathSegments[pathSegments.length - 2];
    const lastPart = pathSegments[pathSegments.length - 1];

    const truncatedLastPart = lastPart.length <= maxLength ? lastPart : `...${lastPart.slice(-maxLength)}`;
    const truncatedURL = `${parsedURL.protocol}//${parsedURL.host}/.../${penultimatePart}/${truncatedLastPart}`;

    return truncatedURL;
  } catch (error) {
    console.error('Invalid URL:', url);
    return url;
  }
}
