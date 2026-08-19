-- Trigger untuk membuat notifikasi otomatis saat pesanan baru dibuat

CREATE OR REPLACE FUNCTION notify_order_created()
RETURNS TRIGGER AS $$
BEGIN
  -- Hanya buat notifikasi jika user_id ada (bukan guest)
  IF NEW.user_id IS NOT NULL THEN
    INSERT INTO public.notifications (
      user_id,
      title,
      message,
      type,
      is_read
    ) VALUES (
      NEW.user_id,
      'Pesanan Dibuat',
      'Pesanan #' || NEW.order_number || ' berhasil dibuat. Silakan lakukan pembayaran.',
      'info',
      false
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Hapus trigger jika sudah ada untuk menghindari duplikasi
DROP TRIGGER IF EXISTS on_order_created_notify ON public.orders;

-- Buat trigger setelah insert pada tabel orders
CREATE TRIGGER on_order_created_notify
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_order_created();

-- Trigger untuk status pesanan berubah menjadi paid
CREATE OR REPLACE FUNCTION notify_order_paid()
RETURNS TRIGGER AS $$
BEGIN
  -- Cek apakah status berubah menjadi paid
  IF NEW.status = 'paid' AND OLD.status != 'paid' AND NEW.user_id IS NOT NULL THEN
    INSERT INTO public.notifications (
      user_id,
      title,
      message,
      type,
      is_read
    ) VALUES (
      NEW.user_id,
      'Pembayaran Berhasil',
      'Pembayaran untuk pesanan #' || NEW.order_number || ' telah diterima. Pesanan sedang diproses.',
      'order_success',
      false
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_order_paid_notify ON public.orders;

CREATE TRIGGER on_order_paid_notify
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_order_paid();
