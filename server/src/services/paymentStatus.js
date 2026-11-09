//? SQL expression: the payment status of the application that has the alias "a"
//? Rule: any paid attempt wins, otherwise the latest attempt decides,
//? and no attempts at all means "not_started".
//? Any query that uses it must write "FROM applications a".
export const PAY_STATUS_SQL = `
  CASE
    WHEN EXISTS (
      SELECT 1
      FROM payments p
      WHERE p.application_id = a.id
        AND p.payment_status = 'paid'
    ) THEN 'paid'

    WHEN NOT EXISTS (
      SELECT 1 
      FROM payments p
      WHERE p.application_id = a.id
    ) THEN 'not_started'

    ELSE (
      SELECT p.payment_status
      FROM payments p
      WHERE p.application_id = a.id
      ORDER BY p.created_at DESC, p.id DESC
      LIMIT 1
    )
  END
`;
