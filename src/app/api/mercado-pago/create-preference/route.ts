import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      message: 'Placeholder: create-preference pendiente de implementación real con Mercado Pago.',
    },
    { status: 501 },
  );
}
