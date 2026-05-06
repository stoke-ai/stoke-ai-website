'use client';

import { useEffect, useRef, useState } from 'react';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          Autocomplete: new (
            input: HTMLInputElement,
            options: Record<string, unknown>
          ) => {
            addListener: (
              eventName: 'place_changed',
              callback: () => void
            ) => { remove: () => void };
            getPlace: () => { formatted_address?: string };
          };
        };
      };
    };
    __stokeGoogleMapsPromise?: Promise<void>;
  }
}

function loadGoogleMaps(apiKey: string) {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.google?.maps?.places?.Autocomplete) return Promise.resolve();
  if (window.__stokeGoogleMapsPromise) return window.__stokeGoogleMapsPromise;

  window.__stokeGoogleMapsPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-stoke-google-maps="true"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Google Maps script failed to load')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.dataset.stokeGoogleMaps = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Maps script failed to load'));
    document.head.appendChild(script);
  });

  return window.__stokeGoogleMapsPromise;
}

export default function AddressAutocomplete({ value, onChange, required }: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocompleteUnavailable, setAutocompleteUnavailable] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey || autocompleteUnavailable) return;

    let listener: { remove: () => void } | undefined;
    let cancelled = false;

    loadGoogleMaps(apiKey)
      .then(() => {
        if (cancelled || !inputRef.current || !window.google?.maps?.places?.Autocomplete) return;

        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          fields: ['formatted_address'],
          types: ['address'],
          componentRestrictions: { country: 'us' },
        });

        listener = autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) onChange(place.formatted_address);
        });
      })
      .catch(() => {
        if (!cancelled) setAutocompleteUnavailable(true);
      });

    return () => {
      cancelled = true;
      listener?.remove();
    };
  }, [apiKey, autocompleteUnavailable, onChange]);

  return (
    <input
      ref={inputRef}
      required={required}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={autocompleteUnavailable ? 'Enter the office address' : 'Start typing the office address'}
      autoComplete="street-address"
      className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-3 text-white"
    />
  );
}
