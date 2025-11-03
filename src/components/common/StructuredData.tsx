// 'use client';

// import { useEffect } from 'react';

// interface StructuredDataProps {
//   data: object | object[];
// }

// /**
//  * Componente para inyectar structured data (JSON-LD) en el head
//  */
// export default function StructuredData({ data }: StructuredDataProps) {
//   useEffect(() => {
//     const scripts = Array.isArray(data) ? data : [data];
    
//     scripts.forEach((schema, index) => {
//       const script = document.createElement('script');
//       script.type = 'application/ld+json';
//       script.id = `structured-data-${index}`;
//       script.text = JSON.stringify(schema);
//       document.head.appendChild(script);
//     });

//     return () => {
//       scripts.forEach((_, index) => {
//         const script = document.getElementById(`structured-data-${index}`);
//         if (script) {
//           document.head.removeChild(script);
//         }
//       });
//     };
//   }, [data]);

//   return null;
// }

