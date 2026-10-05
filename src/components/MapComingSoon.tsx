import { Sword } from 'lucide-react'

export function MapComingSoon() {
  return (
    <section className="page page--map map-coming-soon" aria-labelledby="map-title">
      <img
        className="map-coming-soon__backdrop"
        src="./maps/coming-soon-background.jpg"
        alt=""
        width="1080"
        height="867"
        aria-hidden="true"
      />
      <div className="map-coming-soon__content">
        <div className="map-coming-soon__sword" aria-hidden="true">
          <Sword />
        </div>
        <p className="overline">Nuova scheda in preparazione</p>
        <h1 id="map-title">Coming soon</h1>
        <p>Qualcosa sta prendendo forma... ma dobbiamo aspettare</p>
      </div>
    </section>
  )
}
