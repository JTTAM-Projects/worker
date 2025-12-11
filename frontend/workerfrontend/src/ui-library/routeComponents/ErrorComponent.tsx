import { useNavigate, useRouter } from "@tanstack/react-router";
import Button from "../components/Button";

export type ErrorComponentProps = {
  title?: string;
  description?: string;
};

export default function ErrorComponent({
  title = "Tapahtui virhe",
  description = "Virhe on huomioitu ja kirjattu järjestelmäämme.",
}: ErrorComponentProps) {
  const navigate = useNavigate();
  const router = useRouter();

  return (
    <main className="grid min-h-full place-items-center bg-gray-100 px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-black sm:text-7xl">{title}</h1>
        <p className="mt-6 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">{description}</p>
        <p className="mt-6 text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
          Tarvittaessa ota yhteys ylläpitoon
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button
            title="Yritä uudelleen"
            onClick={() => {
              // Invalidate the route to reload the loader, which will also reset the error boundary
              router.invalidate();
            }}
          />
          <Button title="Takaisin etusivulle" onClick={() => navigate({ to: "/" })} />
          <Button title="Ota yhteyttä" color={"secondary"} onClick={() => navigate({ to: "/" })} />
        </div>
      </div>
    </main>
  );
}
