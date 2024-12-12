// components/ServicesList.tsx
import { JSX } from "preact";

interface ServiceItem {
  english: string;
  maori: string;
}

interface ServicesListProps {
  items: ServiceItem[];
  type: 'en' | 'mi';
}

export function ServicesList(props: ServicesListProps): JSX.Element {
  const { items, type } = props;
  
  const listItems = items.map((service, index) => 
    <li 
      key={index}
      className="bg-[#1a4b8d]/20 p-3 rounded-lg text-[#1a4b8d]"
    >
      {type === 'en' ? service.english : service.maori}
    </li>
  );

  return (
    <ul className="space-y-2">
      {listItems}
    </ul>
  );
}