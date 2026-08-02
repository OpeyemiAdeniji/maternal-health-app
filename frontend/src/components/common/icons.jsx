// small, dependency-free outline icon set, stroke inherits currentColor so parents control color

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

export function TrashIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4.5 7h15" />
      <path d="M9.5 7V5a1.5 1.5 0 0 1 1.5-1.5h2a1.5 1.5 0 0 1 1.5 1.5v2" />
      <path d="M6.5 7l.7 12a1.5 1.5 0 0 0 1.5 1.4h6.6a1.5 1.5 0 0 0 1.5-1.4l.7-12" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </Icon>
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

export function MailIcon(props) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="M4 6.5l8 6.5 8-6.5" />
    </Icon>
  );
}

export function LockIcon(props) {
  return (
    <Icon {...props}>
      <rect x="5" y="10.5" width="14" height="9" rx="1.5" />
      <path d="M7.5 10.5V8a4.5 4.5 0 0 1 9 0v2.5" />
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

export function ChatBubbleIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9A1.5 1.5 0 0 1 18.5 16H9l-4 4v-4H5.5A1.5 1.5 0 0 1 4 14.5v-9Z" />
    </Icon>
  );
}

export function SendIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4.5 12 20 4l-4.5 16-4-6.5-6-1.5Z" />
      <path d="M11.5 13.5 20 4" />
    </Icon>
  );
}

export function ArrowUpIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 19V5" />
      <path d="M6 11l6-6 6 6" />
    </Icon>
  );
}

export function ArrowDownIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 5v14" />
      <path d="M18 13l-6 6-6-6" />
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

export function ClipboardCheckIcon(props) {
  return (
    <Icon {...props}>
      <path d="M9 4.5h6a1 1 0 0 1 1 1V6H8v-.5a1 1 0 0 1 1-1Z" />
      <path d="M8 6H6.5a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 17.5 6H16" />
      <path d="M9 13.3l2.2 2.2 4.3-4.5" />
    </Icon>
  );
}

export function GlobeIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.5 3.8 5.8 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.8-3.8-9s1.3-6.5 3.8-9Z" />
    </Icon>
  );
}

export function MedicalIcon(props) {
  return (
    <Icon {...props}>
      <path d="M9 4.5h6a1 1 0 0 1 1 1V8h2.5a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H16v2.5a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V16H5.5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1H8V5.5a1 1 0 0 1 1-1Z" />
    </Icon>
  );
}

export function NotesIcon(props) {
  return (
    <Icon {...props}>
      <rect x="5" y="3.5" width="14" height="17" rx="1.5" />
      <path d="M8.5 8.5h7" />
      <path d="M8.5 12h7" />
      <path d="M8.5 15.5h4" />
    </Icon>
  );
}

export function BellIcon(props) {
  return (
    <Icon {...props}>
      <path d="M6 10.5a6 6 0 1 1 12 0c0 3 1 4.5 1.5 5.5H4.5C5 15 6 13.5 6 10.5Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </Icon>
  );
}

export function ChartIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4.5 19.5v-8" />
      <path d="M10.5 19.5v-13" />
      <path d="M16.5 19.5v-5.5" />
      <path d="M3 19.5h18" />
    </Icon>
  );
}

export function ShieldIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 3.5 19 6v6c0 4.5-3 7.5-7 8.5-4-1-7-4-7-8.5V6l7-2.5Z" />
      <path d="M9 12l2 2 4-4.5" />
    </Icon>
  );
}

export function InfoIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9.25" />
      <path d="M12 11v5" />
      <path d="M12 8v.01" />
    </Icon>
  );
}

export function MicrophoneIcon(props) {
  return (
    <Icon {...props}>
      <path d="M9 5a3 3 0 0 1 6 0v6a3 3 0 0 1-6 0Z" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
      <path d="M12 17.5V21" />
      <path d="M9 21h6" />
    </Icon>
  );
}

export function SpeakerIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 9.5h3.2L11 6v12l-3.8-3.5H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z" />
      <path d="M15 9a4 4 0 0 1 0 6" />
      <path d="M17.3 6.5a8 8 0 0 1 0 11" />
    </Icon>
  );
}

export function SpeakerFilledIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 9.5h3.2L11 6v12l-3.8-3.5H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z" fill="currentColor" stroke="none" />
      <path d="M15 9a4 4 0 0 1 0 6" />
      <path d="M17.3 6.5a8 8 0 0 1 0 11" />
    </Icon>
  );
}

export function ArrowRightIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 12h16" />
      <path d="M13 5l7 7-7 7" />
    </Icon>
  );
}

export function EditIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 20h4L20 8l-4-4L4 16v4Z" />
      <path d="M14.5 5.5l4 4" />
    </Icon>
  );
}

export function CloudSunIcon(props) {
  return (
    <Icon {...props}>
      <path d="M7 3v1.6" />
      <path d="M2.7 7h1.6" />
      <path d="M3.5 3.5l1.1 1.1" />
      <circle cx="7" cy="7" r="2" />
      <path d="M7.5 12.5A3.5 3.5 0 0 1 14 11a3 3 0 0 1-.5 6h-7a2.5 2.5 0 0 1-1-4.7" />
    </Icon>
  );
}

export function GoogleIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.55-5.17 3.55-8.65Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.88-3c-1.08.72-2.45 1.15-4.05 1.15-3.11 0-5.75-2.1-6.69-4.93H1.3v3.1A12 12 0 0 0 12 24Z"
      />
      <path fill="#FBBC05" d="M5.31 14.32A7.2 7.2 0 0 1 4.93 12c0-.8.14-1.58.38-2.32V6.58H1.3a12 12 0 0 0 0 10.84l4.01-3.1Z" />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.3 6.58l4.01 3.1C6.25 6.85 8.89 4.75 12 4.75Z"
      />
    </svg>
  );
}

export function AppleIcon(props) {
  return (
    <Icon {...props} className={props.className || 'h-5 w-5'}>
      <path
        fill="currentColor"
        stroke="none"
        d="M16.7 12.7c0-2.4 2-3.6 2.1-3.6-1.1-1.6-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.6.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1.9-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.1 3-2.4.6-.9 1-1.8 1.3-2.7-1.7-.6-2.7-2.2-2.7-4.1Zm-2.6-7.6c.7-.8 1.1-1.9 1-3-1 .1-2.1.7-2.8 1.5-.6.7-1.1 1.8-1 2.9 1.1.1 2.2-.5 2.8-1.4Z"
      />
    </Icon>
  );
}
