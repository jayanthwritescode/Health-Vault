# 🎨 Health Vault Design System

## Overview
Modern, minimal, bold aesthetic inspired by One Medical with a medical blue/green color scheme.

## Color Palette

### Light Mode
- **Primary (Medical Blue)**: `hsl(210, 100%, 50%)` - #0080FF
- **Secondary (Medical Green)**: `hsl(160, 84%, 39%)` - #10B981
- **Accent (Warm Coral)**: `hsl(14, 100%, 65%)` - #FF7A59
- **Background**: Pure White `#FFFFFF`
- **Foreground**: Dark Blue-Gray `hsl(215, 25%, 15%)`

### Dark Mode
- **Primary (Bright Teal)**: `hsl(180, 84%, 55%)` - #2DD4BF
- **Secondary (Soft Green)**: `hsl(160, 60%, 50%)` - #34D399
- **Accent (Warm Coral)**: `hsl(14, 100%, 65%)` - #FF7A59
- **Background**: Deep Blue-Gray `hsl(215, 28%, 10%)`
- **Foreground**: Off-White `hsl(210, 40%, 98%)`

## Typography
- **Headings**: Bold, large scale (5xl-7xl for hero)
- **Body**: Relaxed leading for readability
- **Font Feature**: Ligatures enabled

## Spacing
- **Section Padding**: `py-16 md:py-24 lg:py-32`
- **Container Padding**: `px-4 sm:px-6 lg:px-8`
- **Border Radius**: `0.75rem` (12px)

## Components

### Buttons
- **Primary**: Gradient background (blue to green)
- **Large**: `h-14 px-8 text-lg`
- **With Icons**: Icon + text + arrow

### Cards
- **Border**: 2px on hover
- **Shadow**: Soft to large on hover
- **Padding**: `p-8` for content
- **Hover**: Scale icons, change border color

### Badges
- **Variants**: Primary, Secondary, Outline
- **With Icons**: Small icon + text
- **Hover**: Color transition on interactive badges

## Gradients

### Hero Gradient (Light)
```css
background: linear-gradient(135deg, #0066CC 0%, #00B894 100%);
```

### Hero Gradient (Dark)
```css
background: linear-gradient(135deg, #2DD4BF 0%, #10B981 100%);
```

### Text Gradient
```css
background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

## Shadows

### Soft
```css
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06);
```

### Medium
```css
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.06);
```

### Large
```css
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08);
```

## Animations

### Fade In
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Slide Up
```css
@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

## Design Principles

### 1. Bold Typography
- Large, confident headings
- Clear hierarchy
- Generous line height

### 2. Generous Spacing
- Lots of white space
- Breathing room between sections
- Not cluttered

### 3. Subtle Interactions
- Smooth transitions (300ms)
- Scale transforms on hover
- Color shifts on interaction

### 4. Medical Trust
- Blue/green medical colors
- Clean, professional aesthetic
- Trustworthy visual language

### 5. Accessibility
- High contrast ratios
- Clear focus states
- Readable font sizes (16px minimum)

## Usage Examples

### Hero Section
```tsx
<h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
  Healthcare conversations,{' '}
  <span className="gradient-text">simplified</span>
</h1>
```

### Feature Card
```tsx
<Card className="border-2 hover:border-primary/50 transition-all hover:shadow-large">
  <CardContent className="p-8">
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500">
      <Icon className="w-7 h-7 text-white" />
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </CardContent>
</Card>
```

### CTA Button
```tsx
<Button 
  size="lg" 
  className="bg-gradient-primary text-white text-lg h-14 px-8"
>
  <Icon className="w-5 h-5 mr-2" />
  Action Text
  <ArrowRight className="w-5 h-5 ml-2" />
</Button>
```

## Responsive Breakpoints
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## Icon System
- **Lucide React**: Primary icon library
- **Size**: 16px (w-4), 20px (w-5), 24px (w-6), 28px (w-7)
- **Stroke Width**: 2px default

## Grid System
- **2 columns**: md:grid-cols-2
- **3 columns**: lg:grid-cols-3
- **Gap**: gap-6 to gap-12 depending on content

## Status Colors
- **Success**: Green `hsl(160, 84%, 39%)`
- **Warning**: Orange `hsl(38, 92%, 50%)`
- **Error**: Red `hsl(0, 84%, 60%)`
- **Info**: Blue `hsl(210, 100%, 50%)`
