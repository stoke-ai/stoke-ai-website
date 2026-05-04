'use client';

import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useRef } from 'react';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

function AddressInput({ value, onChange, required }: AddressAutocompleteProps) {
  const places = useMapsLibrary('places');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ['formatted_address', 'geometry', 'name'],
      types: ['address'],
      componentRestrictions: { country: 'us' },
    });

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        onChange(place.formatted_address);
      }
    });

    return () => listener.remove();
  }, [places, onChange]);

  return (
    <input
      ref={inputRef}
      required={required}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Start typing the office address"
      autoComplete="street-address"
      className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-3 text-white"
    />
  );
}

export default function AddressAutocomplete(props: AddressAutocompleteProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <AddressInput {...props} />;
  }

  return (
    <APIProvider apiKey={apiKey} libraries={['places']}>
      <AddressInput {...props} />
    </APIProvider>
  );
}
