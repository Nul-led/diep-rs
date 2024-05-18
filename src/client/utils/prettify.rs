pub fn prettify_number<T>(num: T, precision: usize) -> String
where
    T: Into<f64> + Copy,
{
    let num = num.into();
    if num.abs() < 1e3 {
        return format!("{:.0}", num);
    }
    if num.abs() < 1e6 {
        return format!("{:.precision$}k", num / 1e3, precision = precision);
    }
    if num.abs() < 1e9 {
        return format!("{:.precision$}m", num / 1e6, precision = precision);
    }
    if num.abs() < 1e12 {
        return format!("{:.precision$}b", num / 1e9, precision = precision);
    }
    format!("{:.precision$}t", num / 1e12, precision = precision)
}