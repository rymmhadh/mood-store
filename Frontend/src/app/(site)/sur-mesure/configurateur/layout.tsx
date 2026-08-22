/**
 * Le configurateur s'affiche en pleine page, sans en-tête ni pied de page :
 * il possède sa propre barre d'étapes et sa propre sortie. Le décalage
 * appliqué par le gabarit principal est donc neutralisé ici.
 */
export default function LayoutConfigurateur({ children }: { children: React.ReactNode }) {
  return <div className="-mt-[var(--header-h)]">{children}</div>;
}
