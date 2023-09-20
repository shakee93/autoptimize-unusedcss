import { type ClassValue, clsx } from "clsx"
import Code from "components/ui/code";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isImageAudit(audit_id: string) {
  return [
      'offscreen-images',
    'modern-image-formats',
    'unsized-images',
      'uses-responsive-images',
      'uses-optimized-images'
  ].includes(audit_id)
}

export function transformFileType(audit: Audit, type?: string) {

  if(audit.id === 'lcp-lazy-loaded' && type === 'unknown') {
    type = 'image';
  }

  if (type === 'google_font') {
    type = 'font'
  }

  if (type === 'data_image') {
    type = 'image'
  }

  if (type === 'js') {
    type = 'javascript'
  }

  return type
}

export const isDev = import.meta.env.DEV

export function isUrl(input: string): boolean {
  try {
    new URL(input);
    return true;
  } catch (error) {
    return false;
  }
}

export function truncateMiddleOfURL(url: string, maxLength: number, showDomain: boolean = true) {
  try {
    if (url === 'Unattributable') {
      return url;
    }

    const parsedURL = new URL(url);

    // Check if the URL has a trailing slash
    const hasTrailingSlash = url.endsWith('/');

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

    let baseTruncatedURL = showDomain
        ? `${parsedURL.protocol}//${parsedURL.host}/.../${penultimatePart}/`
        : `.../${penultimatePart}/`;

    if (baseTruncatedURL.length + lastPart.length > maxLength) {
      baseTruncatedURL = `${baseTruncatedURL.slice(0, maxLength - lastPart.length - 3)}.../`;
    }

    const truncatedURL = baseTruncatedURL + lastPart + (hasTrailingSlash ? '/' : '');

    return truncatedURL;
  } catch (error) {
    // console.error('Invalid URL:', url);

    if (url) {
      return <Code code={url}></Code>;
    }
  }
}



export function formatNumberWithGranularity(number: number, granularity: number = 1): string {
  const roundedValue = Math.round(number / granularity) * granularity;
  return roundedValue.toFixed(Math.max(0, Math.ceil(-Math.log10(granularity))));
}