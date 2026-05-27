function Err403() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center gap-4">
      <h1 className="text-2xl md:text-5xl">Помилка 403 (FORBIDDEN)</h1>
      <p className="text-md md:text-2xl">
        Роль вашого акаунта не має доступу до обраної сторінки
      </p>
    </div>
  );
}

export default Err403;
