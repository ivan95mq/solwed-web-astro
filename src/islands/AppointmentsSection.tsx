'use client'

import { MessageCircle } from 'lucide-react'

const teamMembers = [
  {
    name: 'María José',
    role: 'Administración',
    iframeSrc: 'https://meet.brevo.com/admin-mariajose/borderless',
  },
  {
    name: 'Iván Moreno',
    role: 'Soporte técnico',
    iframeSrc: 'https://meet.brevo.com/solwed/borderless',
  },
]

export function AppointmentsSection() {
  return (
    <section id="appointments-section" className="py-16 md:py-24 bg-section-dark">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-6">
            <MessageCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Agenda una cita</span>
          </div>
          <h2 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Reserva una <span className="text-gradient">cita</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Elige el horario que mejor te venga y te llamamos nosotros
          </p>
        </div>

        {/* Booking Iframes */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {teamMembers.map((person) => (
            <div
              key={person.name}
              className="flex flex-col items-center"
            >
              <div className="text-center mb-4">
                <h3 className="font-semibold">{person.name}</h3>
                <p className="text-sm text-muted-foreground">{person.role}</p>
              </div>
              <iframe
                src={person.iframeSrc}
                width="100%"
                frameBorder={0}
                className="rounded-xl bg-white h-[600px] sm:h-[750px] md:h-[850px] lg:h-[950px]"
                title={`Reservar cita con ${person.name}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
