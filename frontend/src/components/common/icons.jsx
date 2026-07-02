// small, dependency-free outline icon set — stroke inherits currentColor so parents control color

function Icon({ children, className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

export function HomeIcon(props) {
  return (
    <Icon {...props}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H9.5a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-9" />
    </Icon>
  );
}

export function HeartIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 20.5s-7.5-4.6-9.8-9.3C.8 8 2 4.8 5 3.9c2.1-.6 4 .3 5 2 1-1.7 2.9-2.6 5-2 3 .9 4.2 4.1 2.8 7.3-2.3 4.7-9.8 9.3-9.8 9.3Z" />
    </Icon>
  );
}

export function BookIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H12v18H5.5A1.5 1.5 0 0 1 4 19.5v-15Z" />
      <path d="M20 4.5A1.5 1.5 0 0 0 18.5 3H12v18h6.5a1.5 1.5 0 0 0 1.5-1.5v-15Z" />
    </Icon>
  );
}

export function PhoneIcon(props) {
  return (
    <Icon {...props}>
      <path d="M5.5 3h2.4a1 1 0 0 1 1 .8l.8 3.6a1 1 0 0 1-.5 1.1l-1.8 1a12.5 12.5 0 0 0 5.6 5.6l1-1.8a1 1 0 0 1 1.1-.5l3.6.8a1 1 0 0 1 .8 1V18a2 2 0 0 1-2 2h-1C9.6 20 4 14.4 4 7.5v-1a2 2 0 0 1 1.5-2Z" />
    </Icon>
  );
}

export function PersonIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1-3.5 4-5.5 7.5-5.5s6.5 2 7.5 5.5" />
    </Icon>
  );
}

export function EyeIcon(props) {
  return (
    <Icon {...props}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.75" />
    </Icon>
  );
}

export function EyeOffIcon(props) {
  return (
    <Icon {...props}>
      <path d="M3 3l18 18" />
      <path d="M10.6 5.6c.45-.07.92-.1 1.4-.1 6 0 9.5 6.5 9.5 6.5a15 15 0 0 1-3.2 3.9M6.6 6.6A15.7 15.7 0 0 0 2.5 12S6 18.5 12 18.5c1.3 0 2.5-.2 3.6-.6" />
      <path d="M9.6 9.6a2.75 2.75 0 0 0 3.9 3.9" />
    </Icon>
  );
}

export function CheckCircleIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9.25" />
      <path d="M8 12.3l2.6 2.6L16 9.3" />
    </Icon>
  );
}

export function ChevronRightIcon(props) {
  return (
    <Icon {...props}>
      <path d="M9 5l7 7-7 7" />
    </Icon>
  );
}

export function SparkleIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 3.5c.5 3 2 5.5 5 6-3 .5-4.5 3-5 6-.5-3-2-5.5-5-6 3-.5 4.5-3 5-6Z" />
      <path d="M19 15c.3 1.3.9 2.3 2.2 2.6-1.3.3-1.9 1.3-2.2 2.6-.3-1.3-.9-2.3-2.2-2.6 1.3-.3 1.9-1.3 2.2-2.6Z" />
    </Icon>
  );
}
