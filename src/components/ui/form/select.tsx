;<div>
  <label className="py-0 label">
    <span className="label-text">{label}</span>
  </label>

  <select
    id={id}
    ref={ref}
    name={name}
    type={type}
    aria-label={label}
    defaultValue={defaultValue}
    className="w-full select select-bordered"
    {...props}
  >
    <option disabled selected>
      {defaultValue}
    </option>
    {arrayData?.map((el, idx) => (
      <option key={idx}>{el.name}</option>
    ))}
  </select>

  <label className="pt-0 pb-1.5 label">
    {errors ? (
      <div className="h-0.5 label-text-alt text-error">{errors}</div>
    ) : (
      <div className="h-0.5"></div>
    )}
  </label>
</div>
