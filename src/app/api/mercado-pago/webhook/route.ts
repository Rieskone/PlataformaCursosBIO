import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      message: 'Placeholder: webhook de Mercado Pago pendiente de implementación.',
      received: true,
    },
    { status: 202 },
  );
}
